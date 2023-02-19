import Head from "next/head";
import { forwardRef, InputHTMLAttributes, LegacyRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { MailData, mailSchema } from "root/schemas/mailSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { API } from "root/services/api";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const border = "2px solid #CF291D";
const borderRadius = "4px";
const padding = "10px";
const background = "#e5e5e5";

const Input = forwardRef(
  ({ onChange, onBlur, name, ...props }: InputProps, ref) => {
    return (
      <input
        {...props}
        onChange={onChange}
        onBlur={onBlur}
        name={name}
        ref={ref as LegacyRef<HTMLInputElement>}
        style={{
          width: "100%",
          padding,
          borderRadius,
          border,
          outline: "none",
          background,
          fontWeight: "bold",
          ...props?.style,
        }}
      />
    );
  }
);

Input.displayName = "input";

export default function Home() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<MailData>({
    resolver: zodResolver(mailSchema),
  });

  const { mutateAsync: sendMail, isLoading } = useMutation({
    mutationFn: async (data: MailData) => {
      return await API.post("/mailer", data);
    },
    onSuccess: () => {
      alert("Email enviado com sucesso!");
    },
    onError: () => {
      alert("Email falhou!");
    },
  });

  const submit = useCallback(
    async (data: MailData) => {
      await sendMail(data);
      reset();
    },
    [reset, sendMail]
  );

  return (
    <>
      <Head>
        <title>NextJS - Mail Sender</title>
        <meta
          name="description"
          content="Example of a nextjs mail sender application"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        style={{
          background: "#18191A",
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <form
          onSubmit={handleSubmit(submit)}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            width: "90%",
            maxWidth: "450px",
            alignItems: "center",
          }}
        >
          <h3 style={{ color: "#ffffff", fontSize: "1.5rem" }}>
            Envie uma mensagem
          </h3>
          <Input placeholder="Nome" {...register("user_name")} />
          {errors?.user_name?.message && (
            <span style={{ color: "#CF291D", alignSelf: "flex-start" }}>
              {errors?.user_name?.message}
            </span>
          )}
          <Input placeholder="Email" {...register("user_mail")} />
          {errors?.user_mail?.message && (
            <span style={{ color: "#CF291D", alignSelf: "flex-start" }}>
              {errors?.user_mail?.message}
            </span>
          )}
          <Input placeholder="Assunto" {...register("subject")} />
          {errors?.subject?.message && (
            <span style={{ color: "#CF291D", alignSelf: "flex-start" }}>
              {errors?.subject?.message}
            </span>
          )}
          <textarea
            {...register("content")}
            style={{
              width: "100%",
              padding,
              borderRadius,
              border,
              outline: "none",
              background,
              fontWeight: "bold",
              resize: "none",
              height: "100px",
            }}
            placeholder="Texto"
            maxLength={200}
          />
          {errors?.content?.message && (
            <span style={{ color: "#CF291D", alignSelf: "flex-start" }}>
              {errors?.content?.message}
            </span>
          )}
          <button
            disabled={isLoading}
            type="submit"
            style={{
              width: "50%",
              alignSelf: "flex-end",
              padding,
              borderRadius,
              border: "none",
              background: "#CF291D",
              color: "#ffffff",
              fontWeight: "bold",
              cursor: "pointer",
              opacity: isLoading ? "0.6" : "1",
            }}
          >
            Enviar
          </button>
        </form>
      </main>
    </>
  );
}
