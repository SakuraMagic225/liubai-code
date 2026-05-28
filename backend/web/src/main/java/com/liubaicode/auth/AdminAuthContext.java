package com.liubaicode.auth;

public final class AdminAuthContext {

    private static final ThreadLocal<Long> CURRENT_ADMIN_ID = new ThreadLocal<>();

    private AdminAuthContext() {
    }

    public static void setCurrentAdminId(Long adminId) {
        CURRENT_ADMIN_ID.set(adminId);
    }

    public static Long getCurrentAdminId() {
        return CURRENT_ADMIN_ID.get();
    }

    public static void clear() {
        CURRENT_ADMIN_ID.remove();
    }
}
