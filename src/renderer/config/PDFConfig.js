export default function(settings) {
    const defaults = {
        blackmark_start_first: true,
        blackmark_end_first: true,
        blank_pages_before_labels: 0,
        blank_pages_after_labels: 0,
        blackmark_pages_before_labels: 0,
        blackmark_pages_after_labels: 0,
    };
    const overrides = {};
    if (settings) {
        if (settings.blackmark_start_first) { overrides.blackmark_start_first = settings.blackmark_start_first; }
        if (settings.blackmark_end_first) { overrides.blackmark_end_first = settings.blackmark_end_first; }
        if (settings.blank_pages_before_labels) { overrides.blank_pages_before_labels = settings.blank_pages_before_labels; }
        if (settings.blank_pages_after_labels) { overrides.blank_pages_after_labels = settings.blank_pages_after_labels; }
        if (settings.blackmark_pages_before_labels) { overrides.blackmark_pages_before_labels = settings.blackmark_pages_before_labels; }
        if (settings.blackmark_pages_after_labels) { overrides.blackmark_pages_after_labels = settings.blackmark_pages_after_labels; }
    }
    return Object.assign(defaults, overrides);
}