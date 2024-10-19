
// import React from 'react'
import AuthenTemplate from "../../../components/authen-template";
import { Button, Form, Input } from "antd";
import axios from "axios";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { gooleProvider } from "../../config/firebase";
// import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

function LoginPage() {
  const navigate = useNavigate();

  const api = "https://localhost:7229/api/Auth/login";

  const onFinish = async ({ email, password }) => {
    try {
      const response = await axios.post(api, { email, password });
      console.log(response.data); // handle success
      navigate("/home");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.error("Bad request:", error.response.data); // handle 400 error
        alert(
          "Invalid login credentials. Please check your email and password."
        );
      } else {
        console.error("An error occurred:", error.message); // handle other errors
      }
    }
  };
  useEffect(() => {}, []);

  return (
    <>
      <AuthenTemplate>
        <Form labelCol={{ span: 24 }} onFinish={onFinish}>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input.Password />
          </Form.Item>

          {/* //link react router dom */}
          <Link to="/register">Register new account</Link>

          <Button type="primary" htmlType="submit">
            Login
          </Button>
          {/* <button onClick={handleLoginGoole}>Login Goole</button> */}
        </Form>
      </AuthenTemplate>
    </>
  );
}

export default LoginPage;
