// // import { z } from "zod";

// import { useForm } from "@mantine/form";

// // const schema = z
// //   .object({
// //     username: z
// //       .string()
// //       .min(2, { message: "Username should have at least 2 letters" }),
// //     password: z.string().min(8, "Password must be at least 8 characters long"),
// //     password_confirmation: z
// //       .string()
// //       .min(8, "Password must be at least 8 characters long"),
// //   })
// //   .refine((data) => data.password === data.password_confirmation, {
// //     message: "Passwords do not match",
// //     path: ["confirmPassword"],
// //   });

// // // Add a custom check for password confirmation
// // // schema.refine((data) => data.password === data.password_confirmation, {
// // //   message: "Passwords do not match",
// // //   path: ["password_confirmation"],
// // // });

// // export default schema;

// const validateChangePassword = useForm({
//   initialValues: { npp: "", password: "", password_confirmation: "" },

//   // functions will be used to validate values at corresponding key
//   validate: {
//     npp: (value) => (value ? null : "Npp can't be empty"),
//     password: (value) => (value ? null : "Password can't be empty"),
//     password_confirmation: (value, values) => [
//       value ? null : "Password can't be empty",
//       value === values.password ? null : "Password did not match",
//     ],
//   },
// });

// export default validateChangePassword;
