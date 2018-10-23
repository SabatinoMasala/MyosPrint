import store from 'store';
import PDFConfig from './PDFConfig';
export default function(key) {
    const settings = store.get(`settings_${key}`);
    const pdfSettings = settings ? settings.pdf_settings : {};
    const defaults = {
        orientation: 'tr',
        pdf_settings: {
            b: PDFConfig(pdfSettings.b),
            c: PDFConfig(pdfSettings.c),
            mini_a: PDFConfig(pdfSettings.mini_a),
            mini_b: PDFConfig(pdfSettings.mini_b),
            neck: PDFConfig(pdfSettings.neck)
        },
        sorting: 'labelling'
    };
    const overrides = {};
    if (settings) {
        if (settings.orientation) { overrides.orientation = settings.orientation; }
        if (settings.pdf_settings) { overrides.pdf_settings = settings.pdf_settings; }
        if (settings.sorting) { overrides.sorting = settings.sorting; }
    }
    return Object.assign(defaults, overrides);
}