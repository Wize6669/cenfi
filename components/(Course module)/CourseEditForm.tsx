'use client'

import React, { useEffect, useRef } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Calendar } from "@/components/ui/Calendar"
import { CalendarIcon, PlusCircle, X } from "lucide-react"
import { format } from "date-fns"
import { es } from 'date-fns/locale'
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover"
import { axiosInstance } from "@/lib/axios"
import toast from "react-hot-toast"
import { AxiosError } from "axios"
import { ErrorResponse } from '@/interfaces/ResponseAPI';
import { CourseUpdate } from "@/interfaces/Course";

interface CourseEditFormProps {
  courseId: string;
}

export default function CourseEditForm({ courseId }: CourseEditFormProps) {
  const { control, handleSubmit, setValue, reset } = useForm<CourseUpdate>();
  const queryClient = useQueryClient();
  const formRef = useRef<HTMLFormElement | null>(null);

  const { fields: paymentFields, append: appendPayment, remove: removePayment } = useFieldArray({
    control,
    name: "paymentOptions",
  });

  const { fields: syllabusFields, append: appendSyllabus, remove: removeSyllabus } = useFieldArray({
    control,
    name: "syllabus",
  });

  const { fields: benefitFields, append: appendBenefit, remove: removeBenefit } = useFieldArray({
    control,
    name: "benefits",
  });

  const { fields: inPersonScheduleFields, append: appendInPersonSchedule, remove: removeInPersonSchedule } = useFieldArray({
    control,
    name: "inPersonSchedules",
  });

  const { fields: virtualScheduleFields, append: appendVirtualSchedule, remove: removeVirtualSchedule } = useFieldArray({
    control,
    name: "virtualSchedules",
  });

  useEffect(() => {
    axiosInstance.get(`/courses/${courseId}`).then((response) => {
      const courseData = response.data;
      reset(courseData);
      setValue('startDate', courseData.startDate ? new Date(courseData.startDate) : undefined);
      setValue('endDate', courseData.endDate ? new Date(courseData.endDate) : undefined);
    }).catch(error => {
      if (error instanceof AxiosError) {
        if (error?.response?.status === 400) {
          const errors = error?.response?.data.errors;
          const errorApi = error?.response?.data.error;

          if (Array.isArray(errors)) {
            const errorsMessages = errors
              .map((errorMessage: ErrorResponse) => errorMessage?.message)
              .join('\n');

            return toast.error(errorsMessages);
          }

          return toast.error(errorApi.message);
        }
      }

      toast.error('Ocurrió un error inesperado, inténtelo nuevamente más tarde');

      if (formRef.current) {
        formRef.current.reset();
      }
    });
  }, [courseId, reset, setValue]);

  const updateCourse = async (data: CourseUpdate) => {
    try {
      await axiosInstance.post(`/courses/${courseId}`, data);
      toast.success('Curso actualizado con éxito');
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error?.response?.status === 400) {
          const errors = error?.response?.data.errors;
          const errorApi = error?.response?.data.error;

          if (Array.isArray(errors)) {
            const errorsMessages = errors
              .map((errorMessage: ErrorResponse) => errorMessage?.message)
              .join('\n');

            return toast.error(errorsMessages);
          }

          return toast.error(errorApi.message);
        }
      }

      toast.error('Ocurrió un error inesperado, inténtelo nuevamente más tarde');
    }
  }

  const { mutateAsync: updateCourseMutation } = useMutation({
    mutationFn: updateCourse,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['courses'] });
    }
  });

  const onSubmit = handleSubmit(async (data) => {
    await updateCourseMutation(data);
  });

  return (
    <div className="container mx-auto pb-8 max-w-4xl sm:px-6 lg:px-0 px-6 sm:pt-2 lg:pt-0 pt-2">
      <form ref={formRef} onSubmit={onSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-base">Nombre del curso</Label>
              <Controller
                name="name"
                defaultValue={''}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    className="mt-1 dark:bg-gray-700 dark:text-white"
                    placeholder="Ingrese un nombre para el curso"
                  />
                )}
              />
            </div>
            <div>
              <Label htmlFor="university" className="text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-base">Universidad</Label>
              <Controller
                name="university"
                defaultValue={''}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    className="mt-1 dark:bg-gray-700 dark:text-white"
                    placeholder="Ingrese el nombre de la universidad"
                  />
                )}
              />
            </div>
            <div>
              <Label htmlFor="schedule" className="text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-base">Régimen</Label>
              <Controller
                name="schedule"
                defaultValue={''}
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    className="mt-1 dark:bg-gray-700 dark:text-white"
                    placeholder="Ingrese el régimen del curso"
                  />
                )}
              />
            </div>
          </div>
          <div>
            <Label className="text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-base">Fecha de inicio</Label>
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !field.value && "text-muted-foreground",
                        "dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4"/>
                      {field.value ? format(field.value, "dd 'de' MMMM 'de' yyyy", { locale: es }) : <span>Selecciona una fecha</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value ?? undefined}
                      onSelect={field.onChange}
                      initialFocus
                      className="dark:bg-gray-800 dark:text-gray-200"
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>
          <div>
            <Label className="text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-base">Fecha de finalización</Label>
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !field.value && "text-muted-foreground",
                        "dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4"/>
                      {field.value ? format(field.value, "dd 'de' MMMM 'de' yyyy", { locale: es }) : <span>Selecciona una fecha</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value ?? undefined}
                      onSelect={field.onChange}
                      initialFocus
                      className="dark:bg-gray-800 dark:text-gray-200"
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>
          <div>
            <Label htmlFor="cost" className="text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-base">Costo</Label>
            <Controller
              name="cost"
              defaultValue={0}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  className="mt-1 dark:bg-gray-700 dark:text-white"
                  placeholder="Ingrese el costo del curso"
                />
              )}
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-base">Teléfono</Label>
            <Controller
              name="phone"
              defaultValue={''}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  className="mt-1 dark:bg-gray-700 dark:text-white"
                  placeholder="Ingrese el número de teléfono"
                />
              )}
            />
          </div>
          <div>
            <Label className="text-gray-700 dark:text-gray-300 mr-2 text-sm sm:text-base md:text-base">Opciones de pago</Label>
            {paymentFields.map((field, index) => (
              <div key={field.id} className="flex items-center mt-2">
                <Controller
                  name={`paymentOptions.${index}`}
                  defaultValue={['']}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="dark:bg-gray-700 dark:text-white"
                      placeholder="Ingrese una opción de pago"
                    />
                  )}
                />
                <Button type="button" variant="ghost" size="sm" onClick={() => removePayment(index)}><X className="h-4 w-4"/></Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => appendPayment('')}
                    className="mt-2 mr-4 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">
              <PlusCircle className="h-4 w-4 mr-2"/>
              Agregar opción de pago
            </Button>
          </div>
          <div>
            <Label className="text-gray-700 dark:text-gray-300 mr-2 text-sm sm:text-base md:text-base">Temario</Label>
            {syllabusFields.map((field, index) => (
              <div key={field.id} className="flex items-center mt-2">
                <Controller
                  name={`syllabus.${index}`}
                  defaultValue={['']}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="dark:bg-gray-700 dark:text-white"
                      placeholder="Ingrese un tema del temario"
                    />
                  )}
                />
                <Button type="button" variant="ghost" size="sm" onClick={() => removeSyllabus(index)}><X className="h-4 w-4"/></Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => appendSyllabus('')}
                    className="mt-2 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">
              <PlusCircle className="h-4 w-4 mr-2"/>
              Agregar tema
            </Button>
          </div>
          <div>
            <Label className="text-gray-700 dark:text-gray-300 mr-2 text-sm sm:text-base md:text-base">Beneficios</Label>
            {benefitFields.map((field, index) => (
              <div key={field.id} className="flex items-center mt-2">
                <Controller
                  name={`benefits.${index}`}
                  defaultValue={['']}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="dark:bg-gray-700 dark:text-white"
                      placeholder="Ingrese un beneficio"
                    />
                  )}
                />
                <Button type="button" variant="ghost" size="sm" onClick={() => removeBenefit(index)}><X className="h-4 w-4"/></Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => appendBenefit('')}
                    className="mt-2 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">
              <PlusCircle className="h-4 w-4 mr-2"/>
              Agregar beneficio
            </Button>
          </div>
          <div>
            <Label className="text-gray-700 dark:text-gray-300 mr-2 text-sm sm:text-base md:text-base">Horarios presenciales</Label>
            {inPersonScheduleFields.map((field, index) => (
              <div key={field.id} className="flex items-center mt-2">
                <Controller
                  name={`inPersonSchedules.${index}`}
                  defaultValue={['']}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="dark:bg-gray-700 dark:text-white"
                      placeholder="Ingrese un horario específico"
                    />
                  )}
                />
                <Button type="button" variant="ghost" size="sm" onClick={() => removeInPersonSchedule(index)}><X className="h-4 w-4"/></Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => appendInPersonSchedule('')}
                    className="mt-2 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">
              <PlusCircle className="h-4 w-4 mr-2"/>
              Agregar horario
            </Button>
          </div>
          <div>
            <Label className="text-gray-700 dark:text-gray-300 mr-2 text-sm sm:text-base md:text-base">Horarios virtuales</Label>
            {virtualScheduleFields.map((field, index) => (
              <div key={field.id} className="flex items-center mt-2">
                <Controller
                  name={`virtualSchedules.${index}`}
                  defaultValue={['']}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      className="dark:bg-gray-700 dark:text-white"
                      placeholder="Ingrese un horario específico"
                    />
                  )}
                />
                <Button type="button" variant="ghost" size="sm" onClick={() => removeVirtualSchedule(index)}><X className="h-4 w-4"/></Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => appendVirtualSchedule('')}
                    className="mt-2 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600">
              <PlusCircle className="h-4 w-4 mr-2"/>
              Agregar horario
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
          <Button type="submit" className="text-sm sm:text-base md:text-base bg-button-color hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-full mt-2 transition-colors ease-in-out duration-200">
            Actualizar Curso
          </Button>
        </div>
      </form>
    </div>
  )
}
