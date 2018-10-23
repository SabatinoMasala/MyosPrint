const DownloadConversionProgress = {
    downloads: 0,
    conversions: 0,
    totalDownloads: 0,
    totalConversions: 0,
    currentPDF: false,
    currentProcedure: false,
    cancelled: false,
    reset() {
        this.downloads = 0;
        this.conversions = 0;
        this.totalDownloads = 0;
        this.totalConversions = 0;
        this.currentPDF = false;
        this.currentProcedure = false;
        this.cancelled = false;
    }
};

export default DownloadConversionProgress;