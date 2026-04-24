import { useState, useCallback, useMemo } from "react";
import { Post } from "@/types/blog";
import { isValidCategory } from "@/lib/utils";

// Fields the form manages (subset of Post — server fills the rest)
type PostFormValues = Pick<
    Post,
    "title" | "excerpt" | "content" | "category" | "tags" | "status" | "coverImageUrl"
>;

interface PostFormErrors {
    title?: string;
    excerpt?: string;
    content?: string;
    category?: string;
}

interface UsePostFormReturn {
    values: PostFormValues;
    handleChange: <K extends keyof PostFormValues>(field: K, value: PostFormValues[K]) => void;
    errors: PostFormErrors;
    handleSubmit: (onSubmit: (values: PostFormValues) => void) => void;
    reset: () => void;
    isDirty: boolean;
    wordCount: number;
    readingTimeMinutes: number;
}

const DEFAULT_VALUES: PostFormValues = {
    title: "",
    excerpt: "",
    content: "",
    category: "technology",
    tags: [],
    status: "draft",
    coverImageUrl: "",
};

function validate(values: PostFormValues): PostFormErrors {
    const errors: PostFormErrors = {};

    if (!values.title || values.title.trim().length < 5) {
        errors.title = "Title is required and must be at least 5 characters.";
    }
    if (!values.excerpt || values.excerpt.trim().length === 0) {
        errors.excerpt = "Excerpt is required.";
    } else if (values.excerpt.trim().length > 200) {
        errors.excerpt = "Excerpt must be 200 characters or less.";
    }
    if (!values.content || values.content.trim().length < 50) {
        errors.content = "Content is required and must be at least 50 characters.";
    }
    if (!values.category || !isValidCategory(values.category)) {
        errors.category = "Please select a valid category.";
    }

    return errors;
}

export function usePostForm(initialValues?: Partial<PostFormValues>): UsePostFormReturn {
    const initial: PostFormValues = { ...DEFAULT_VALUES, ...initialValues };

    const [values, setValues] = useState<PostFormValues>(initial);
    const [errors, setErrors] = useState<PostFormErrors>({});

    // Update a single field
    const handleChange = useCallback(
        <K extends keyof PostFormValues>(field: K, value: PostFormValues[K]) => {
            setValues((prev) => ({ ...prev, [field]: value }));
        },
        []
    );

    // Validate + call onSubmit if no errors
    const handleSubmit = useCallback(
        (onSubmit: (values: PostFormValues) => void) => {
            const validationErrors = validate(values);
            setErrors(validationErrors);
            if (Object.keys(validationErrors).length === 0) {
                onSubmit(values);
            }
        },
        [values]
    );

    // Reset form back to initial values
    const reset = useCallback(() => {
        setValues(initial);
        setErrors({});
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // isDirty: true if any field differs from initial
    const isDirty = useMemo(() => {
        return (Object.keys(values) as (keyof PostFormValues)[]).some(
            (key) => JSON.stringify(values[key]) !== JSON.stringify(initial[key])
        );
    }, [values]); // eslint-disable-line react-hooks/exhaustive-deps

    // Live word count of content
    const wordCount = useMemo(() => {
        const trimmed = values.content.trim();
        if (!trimmed) return 0;
        return trimmed.split(/\s+/).length;
    }, [values.content]);

    // Auto-computed reading time, minimum 1
    const readingTimeMinutes = useMemo(
        () => Math.max(1, Math.ceil(wordCount / 200)),
        [wordCount]
    );

    return {
        values,
        handleChange,
        errors,
        handleSubmit,
        reset,
        isDirty,
        wordCount,
        readingTimeMinutes,
    };
}