export function changeExtension(file, ext) {
    return file.substr(0, file.lastIndexOf('.')) + '.' + ext;
}