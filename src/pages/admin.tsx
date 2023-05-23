import { SignIn } from "@clerk/nextjs";
import React from "react";

const admin = () => {
    return (
        <div>
            <SignIn 
                appearance={{
                    variables: {
                    colorBackground: "#20222e",
                    colorText: "#ffffff",
                    colorPrimary: "#6C47FF",
                    fontWeight: { normal: 300 },
                    colorInputBackground: "#292c3e",
                    colorInputText: "#ffffff"
                    }
                }}
            />
        </div>
    );
};

export default admin;