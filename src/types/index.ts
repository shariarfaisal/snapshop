export * from "./campus";
export * from "./user";
export * from "./admission";
export * from "./exam";
export * from "./finance";
export * from "./form";
export * from "./notification";
export * from "./program";
export * from "./schoolClass";
export * from "./section";
export * from "./subject";


export type Paginated<T> = {
    data: T[];
    total: number;
    page: number;
    limit: number;
}