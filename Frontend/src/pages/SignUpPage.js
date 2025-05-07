import React from "react";
import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
  return (
    <div>
      <SignUp path="/signup" routing="path" signInUrl="/login" />
    </div>
  );
};

export default SignUpPage;
