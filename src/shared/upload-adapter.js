import { apiurl, baseurl } from "./baseurl";

export default class UploadAdapter {
    constructor( loader ) {
        this.loader = loader;
    }

    upload() {
        const loader = this.loader;
        return loader.file
            .then( file => {
                const files = new FormData();
                files.append('custom-file', file);
                return fetch(apiurl+'fileupload', {
                    method: 'POST',
                    body: files
                })
            }).then(res => res.json())
            .then(urls => {
                return {
                    default: baseurl+urls['custom-file']
                };
            });
    }
}