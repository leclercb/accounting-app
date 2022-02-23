export function changeExtension(file, ext) {
    return file.substring(0, file.lastIndexOf('.')) + '.' + ext;
}