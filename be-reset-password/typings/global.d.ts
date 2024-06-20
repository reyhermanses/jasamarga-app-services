import express = require("express");

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        username: string;
        nama: string;
        access: boolean;
        unit_kerja_id: string;
        role: string;
        // Add other properties if needed
      };
    }
  }
}
