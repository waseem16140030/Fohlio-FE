import { TagProps } from "antd";
import {
  ApartmentOutlined,
  SignatureOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React from "react";

export const userRoleColorMap: Record<string, TagProps["color"]> = {
  admin: "green-inverse",
  user: "gold-inverse",
  manager: "blue-inverse",
};

export const userStatusColorMap: Record<string, TagProps["color"]> = {
  active: "green",
  banned: "error",
  pending: "blue",
};

export const userRoleIconMap: Record<string, React.FC> = {
  admin: SignatureOutlined,
  user: UserOutlined,
  manager: ApartmentOutlined,
};
