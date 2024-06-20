import React, { useEffect, useState } from "react";
import axios from "axios";

export class UserController {
  static getAll = async (bearer: string) => {
    let mounted = false;
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/user/`,
        {
          headers: {
            Authorization: `Bearer ${bearer}`,
          },
        }
      );
      return response;
    } catch (error) {
      return error;
    } finally {
      return "success";
    }
  };
}
