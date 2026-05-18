import { useApp } from "@/App/composables/useApp";

const useUser = () => {
    const { user } = useApp();

    const userTypes = {
        TYPE_SUPERADMIN: "superadmin",
        TYPE_ADMIN: "admin",
        TYPE_API_USER: "api-user",
        TYPE_CUSTOMER: "customer",
    };

    const getUserTypes = () => {
        return {
            [userTypes.TYPE_SUPERADMIN]: "Super administrátor",
            [userTypes.TYPE_ADMIN]: "Administrátor",
            [userTypes.TYPE_API_USER]: "Api uživatel",
            [userTypes.TYPE_CUSTOMER]: "Zákazník",
        };
    };

    const getCurrentUserType = () => {
        return user.Type;
    };

    return {
        userTypes,
        getUserTypes,
        getCurrentUserType
    };
};

export { useUser };
