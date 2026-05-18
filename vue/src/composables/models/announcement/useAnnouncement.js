const useAnnouncement = () => {

    const announcements = {
        TYPE_INFO: "info",
        TYPE_SUCCESS: "success",
        TYPE_WARNING: "warning",
        TYPE_ERROR: "error",
    };

    const getTypes = () => {
        return {
            [announcements.TYPE_INFO]: "Informace",
            [announcements.TYPE_SUCCESS]: "Úspěch",
            [announcements.TYPE_WARNING]: "Varování",
            [announcements.TYPE_ERROR]: "Chyba",
        };
    };

    return {
        announcements,
        getTypes,
    };
};

export { useAnnouncement };
