const DownloadConversionProgress = {
    downloads: 0,
    conversions: 0,
    totalDownloads: 0,
    totalConversions: 0,
    currentProcedure: false,
    reset() {
        this.downloads = 0;
        this.conversions = 0;
        this.totalDownloads = 0;
        this.totalConversions = 0;
        this.currentProcedure = false;
    }
};

export default DownloadConversionProgress;