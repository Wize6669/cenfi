'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { Button } from "@/components/ui/Button";
import * as Toast from '@radix-ui/react-toast';
import { useEmailSubmission } from '@/hooks/useEmailSubmission';

interface FormInputs {
  name: string;
  email: string;
  message: string;
}

export const ContactForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormInputs>();
  const { submitEmail, isSubmitting, result } = useEmailSubmission();

  const [open, setOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: "", description: "", variant: "default" });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    await submitEmail(data);
    if (result?.success) {
      setToastMessage({
        title: "Éxito",
        description: "Tu mensaje ha sido enviado con éxito.",
        variant: "default"
      });
      setOpen(true);
      reset();
    } else {
      setToastMessage({
        title: "Error",
        description: "No se pudo enviar tu mensaje. Por favor, intenta de nuevo.",
        variant: "destructive"
      });
      setOpen(true);
    }
  };

  return (
    <>
      <Card className="h-full shadow-lg dark:border-none hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:text-white">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-6 text-blue-900 dark:text-blue-300">Envíanos un mensaje</h2>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register("name", { required: "El nombre es requerido" })}
              type="text"
              placeholder="Ingresa tu nombre"
              className="border-blue-200 dark:border-blue-600 focus:border-blue-400 dark:focus:border-blue-500"
            />
            {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}

            <Input
              {...register("email", {
                required: "El correo electrónico es requerido",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Dirección de correo inválida"
                }
              })}
              type="email"
              placeholder="Ingresa tu correo electrónico"
              className="border-blue-200 dark:border-blue-600 focus:border-blue-400 dark:focus:border-blue-500"
            />
            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}

            <TextArea
              {...register("message", { required: "El mensaje es requerido" })}
              placeholder="Ingresa el mensaje que quieres enviar"
              className="border-blue-200 dark:border-blue-600 focus:border-blue-400 dark:focus:border-blue-500 h-32"
            />
            {errors.message && <span className="text-red-500 text-sm">{errors.message.message}</span>}

            <Button
              type="submit"
              className="w-full bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Toast UI */}
      <Toast.Provider swipeDirection="right">
        <Toast.Root
          open={open}
          onOpenChange={setOpen}
          className={`bg-gray-800 p-4 rounded-lg shadow-lg ${toastMessage.variant === "destructive" ? "bg-red-600" : "bg-green-600"}`}
        >
          <Toast.Title className="text-white font-semibold">{toastMessage.title}</Toast.Title>
          <Toast.Description className="text-gray-200">{toastMessage.description}</Toast.Description>
          <Toast.Action asChild altText="Close">
            <button className="text-white">Cerrar</button>
          </Toast.Action>
        </Toast.Root>

        <Toast.Viewport className="fixed bottom-4 right-4 z-50" />
      </Toast.Provider>
    </>
  );
};
