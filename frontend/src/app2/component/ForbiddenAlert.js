// components/ForbiddenAlert.jsx

import { App } from "antd";
import { useEffect } from "react";

export default function ForbiddenAlert() {
    const { modal } = App.useApp();

    useEffect(() => {
        modal.error({
            title: "403 Forbidden",
            content: "You don't have permission to access this page.",
            centered: true,
        });
    }, []);

    return null;
}