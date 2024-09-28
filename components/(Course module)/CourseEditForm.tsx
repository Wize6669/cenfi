'use client'

import React, {ChangeEvent, FormEvent, useEffect, useRef, useState} from 'react';
import { useForm, useFieldArray } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { Calendar } from "@/components/ui/Calendar"
import { CalendarIcon, PlusCircle, X } from "lucide-react"
import { format } from "date-fns"
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
import Footer from "@/components/Footer";
import { CourseUpdate } from "@/interfaces/Course";

interface CourseEditFormProps {
  courseId: string;
}

export default function CourseEditForm({ courseId }: CourseEditFormProps) {
  const {register, control, formState: {}, reset} = useForm<CourseUpdate>();
  const [course, setCourse] = useState<CourseUpdate>({
    name: '',
    university: '',
    schedule: '',
    startDate: null,
    endDate: null,
    cost: 0,
    paymentOptions: [],
    syllabus: [],
    benefits: [],
    phone: '',
    schedules: [],
  });

  const {fields: paymentFields, append: appendPayment, remove: removePayment} = useFieldArray({
    control,
    name: "paymentOptions",
  });

  const {fields: syllabusFields, append: appendSyllabus, remove: removeSyllabus} = useFieldArray({
    control,
    name: "syllabus",
  });

  const {fields: benefitFields, append: appendBenefit, remove: removeBenefit} = useFieldArray({
    control,
    name: "benefits",
  });

  const {fields: scheduleFields, append: appendSchedule, remove: removeSchedule} = useFieldArray({
    control,
    name: "schedules",
  });

  const queryClient = useQueryClient();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    axiosInstance.get(`/course/${courseId}`).then((response) => {
      const courseData = response.data;
      setCourse(courseData);
      setStartDate(courseData.startDate ? new Date(courseData.startDate) : undefined);
      setEndDate(courseData.endDate ? new Date(courseData.endDate) : undefined);
      reset(courseData);
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

      setCourse({
        name: '',
        university: '',
        schedule: '',
        startDate: null,
        endDate: null,
        cost: 0,
        paymentOptions: [],
        syllabus: [],
        benefits: [],
        phone: '',
        schedules: [],
      });
    });
  }, [courseId, reset]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target;
    setCourse(prevCourse => ({
      ...prevCourse,
      [name]: name === 'cost' ? parseFloat(value) : value
    }));
  };

  const handleArrayChange = (index: number, value: string, field: keyof CourseUpdate) => {
    setCourse(prevCourse => ({
      ...prevCourse,
      [field]: prevCourse[field] instanceof Array ?
        prevCourse[field].map((item, i) => i === index ? value : item) :
        value
    }));
  };
  const handleSubmitForm = async (event: FormEvent) => {
    event.preventDefault();
    await updateCourseMutation();
  };

  const updateCourse = async () => {
    try {
      const updatedCourse = {
        ...course,
        startDate: startDate || null,
        endDate: endDate || null,
      };
      await axiosInstance.post(`/course/update-course/${courseId}`, updatedCourse);
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

  const {mutateAsync: updateCourseMutation} = useMutation({
    mutationFn: updateCourse,
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ['courses']});
    }
  });

  return (
        <div className="container mx-auto pb-8 max-w-4xl">
          <form ref={formRef} onSubmit={handleSubmitForm} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div>
                  <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Nombre del curso</Label>
                  <Input
                    id="name"
                    name="name"
                    value={course.name}
                    onChange={handleInputChange}
                    className="mt-1 dark:bg-gray-700 dark:text-white"
                    placeholder="Ingrese un nombre para el curso"
                  />
                </div>
                <div>
                  <Label htmlFor="university" className="text-gray-700 dark:text-gray-300">Universidad</Label>
                  <Input
                    id="university"
                    name="university"
                    value={course.university}
                    onChange={handleInputChange}
                    className="mt-1 dark:bg-gray-700 dark:text-white"
                    placeholder="Ingrese el nombre de la universidad"
                  />
                </div>
                <div>
                  <Label htmlFor="schedule" className="text-gray-700 dark:text-gray-300">Régimen</Label>
                  <Input
                    id="schedule"
                    name="schedule"
                    value={course.schedule}
                    onChange={handleInputChange}
                    className="mt-1 dark:bg-gray-700 dark:text-white"
                    placeholder="Ingrese el régimen del curso"
                  />
                </div>
              </div>
              <div>
                <Label className="text-gray-700 dark:text-gray-300">Fecha de inicio</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4"/>
                      {startDate ? format(startDate, "yyyy-MM-dd") : <span>Selecciona una fecha</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className="text-gray-700 dark:text-gray-300">Fecha de finalización</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4"/>
                      {endDate ? format(endDate, "yyyy-MM-dd") : <span>Selecciona una fecha</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="cost" className="text-gray-700 dark:text-gray-300">Costo</Label>
                <Input
                  id="cost"
                  name="cost"
                  type="number"
                  value={course.cost}
                  onChange={handleInputChange}
                  className="mt-1 dark:bg-gray-700 dark:text-white"
                  placeholder="Ingrese el costo del curso"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">Teléfono</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={course.phone}
                  onChange={handleInputChange}
                  className="mt-1 dark:bg-gray-700 dark:text-white"
                  placeholder="Ingrese el número de teléfono"
                />
              </div>
              <div>
                <Label className="text-gray-700 dark:text-gray-300 mr-2">Opciones de pago</Label>
                {paymentFields.map((field, index) => (
                  <div key={field.id} className="flex items-center mt-2">
                    <Input
                      {...register(`paymentOptions.${index}` as const)}
                      value={course.paymentOptions[index] || ''}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'paymentOptions')}
                      className="dark:bg-gray-700 dark:text-white"
                      placeholder="Ingrese una opción de pago"
                    />
                    <Button type="button" variant="ghost" size="sm" onClick={() => removePayment(index)}><X
                      className="h-4 w-4"/></Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendPayment('')}
                        className="mt-2 mr-4">
                  <PlusCircle className="h-4 w-4 mr-2"/>
                  Agregar opción de pago
                </Button>
              </div>
              <div>
                <Label className="text-gray-700 dark:text-gray-300 mr-2">Temario</Label>
                {syllabusFields.map((field, index) => (
                  <div key={field.id} className="flex items-center mt-2">
                    <Input
                      {...register(`syllabus.${index}` as const)}
                      value={course.syllabus[index] || ''}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'syllabus')}
                      className="dark:bg-gray-700 dark:text-white"
                      placeholder="Ingrese un tema del temario"
                    />
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeSyllabus(index)}><X
                      className="h-4 w-4"/></Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendSyllabus('')}
                        className="mt-2">
                  <PlusCircle className="h-4 w-4 mr-2"/>
                  Agregar tema
                </Button>
              </div>
              <div>
                <Label className="text-gray-700 dark:text-gray-300 mr-2">Beneficios</Label>
                {benefitFields.map((field, index) => (
                  <div key={field.id} className="flex items-center mt-2">
                    <Input
                      {...register(`benefits.${index}` as const)}
                      value={course.benefits[index] || ''}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'benefits')}
                      className="dark:bg-gray-700 dark:text-white"
                      placeholder="Ingrese un beneficio"
                    />
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeBenefit(index)}><X
                      className="h-4 w-4"/></Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendBenefit('')}
                        className="mt-2">
                  <PlusCircle className="h-4 w-4 mr-2"/>
                  Agregar beneficio
                </Button>
              </div>
              <div>
                <Label className="text-gray-700 dark:text-gray-300 mr-2">Horarios específicos</Label>
                {scheduleFields.map((field, index) => (
                  <div key={field.id} className="flex items-center mt-2">
                    <Input
                      {...register(`schedules.${index}` as const)}
                      value={course.schedules[index] || ''}
                      onChange={(e) => handleArrayChange(index, e.target.value, 'schedules')}
                      className="dark:bg-gray-700 dark:text-white"
                      placeholder="Ingrese un horario específico"
                    />
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeSchedule(index)}><X
                      className="h-4 w-4"/></Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendSchedule('')}
                        className="mt-2">
                  <PlusCircle className="h-4 w-4 mr-2"/>
                  Agregar horario
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <Button type="submit"
                      className="bg-button-color hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-full mt-2 transition-colors ease-in-out duration-200">Actualizar
                Curso</Button>
            </div>
          </form>
    </div>
  )
}
