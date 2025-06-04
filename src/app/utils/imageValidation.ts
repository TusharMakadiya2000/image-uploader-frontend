type FilesExtType = {
    [key: string]: Array<string>;
};

type AllowedFilesType = {
    [key: string]: Array<string>;
};
type FilesSizeType = {
    [key: string]: number;
};

export function classNames(...classes: unknown[]): string {
    return classes.filter(Boolean).join(" ");
}

export const filesExt: FilesExtType = {
    image: ["jpg", "jpeg", "png"],
};
export const allowedFiles: AllowedFilesType = {
    image: ["image/jpg,image/jpeg,image/png"],
};
export const filesSize: FilesSizeType = {
    image: 5242880,
};
