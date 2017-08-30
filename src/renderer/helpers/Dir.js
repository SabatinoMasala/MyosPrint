import fs from 'fs'
import app from 'electron'

export default {
    getBaseDir() {
        return app.remote.app.getPath('documents') + '/myos-print';
    },
    getPDFDir() {
        return this.getBaseDir() + '/pdf';
    },
    getImagesDir() {
        return this.getBaseDir() + '/images';
    },
    setup() {
        if (!fs.existsSync( this.getBaseDir() )){
            fs.mkdirSync( this.getBaseDir() );
        }
        if (!fs.existsSync( this.getPDFDir() )){
            fs.mkdirSync( this.getPDFDir() );
        }
        if (!fs.existsSync( this.getImagesDir() )){
            fs.mkdirSync( this.getImagesDir() );
        }
    }
}