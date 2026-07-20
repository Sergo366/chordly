import { Category, Season } from "@/shared/clothes";

export type FormValues = {
    title: string;
    userTitle: string;
    category: Category | "";
    type: string;
    size: string | null;
    brand: string | null;
    seasons: Season[];
}

export const defaultFormValues: FormValues = {
    title: '',
    userTitle: '',
    category: '',
    type: '',
    size: null,
    brand: null,
    seasons: [],
};