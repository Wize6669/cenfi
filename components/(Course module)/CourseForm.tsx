'use client';

import React, {useState, useRef, useEffect} from 'react'
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form'
import {useMutation, useQueryClient} from '@tanstack/react-query'
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
import { CourseCreate } from '@/interfaces/Course'
import { axiosInstance } from "@/lib/axios"
import toast from "react-hot-toast"
import {useRouter} from "next/navigation";
import {useAuthStore} from "@/store/auth";
import {handleAxiosError} from "@/utils/errorHandler";

export default function CourseForm() {
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm<CourseCreate>({
    defaultValues: {
      name: '',
      university: '',
      schedule: '',
      startDate: null,
      endDate: null,
      cost: undefined,
      phone: '',
      paymentOptions: [''],
      syllabus: [''],
      benefits: [''],
      inPersonSchedules: [''],
      virtualSchedules: [''],
    }
  });

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

  const router = useRouter();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const userAuth = useAuthStore((state) => state.userAuth);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const [showLoginMessage, setShowLoginMessage] = useState(false);

  const queryClient = useQueryClient();

  const formRef = useRef<HTMLFormElement | null>(null);

  useEffect(() => {
    if (userAuth?.roleId !== 1 || !isLoggedIn) {
      setShowLoginMessage(true);
      const timer = setTimeout(() => {
        router.replace('/admin');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [userAuth, router, isLoggedIn]);

  const addCourse = async (data: CourseCreate) => {
    try {
      await axiosInstance.post('/courses/', data);
      toast.success("Curso creado con éxito!");
      formRef.current?.reset()
    } catch (error) {
      handleAxiosError(error, {
        conflict: 'El curso ya existe',
        default: 'Error al crear el curso, ocurrió un error inesperado, inténtelo nuevamente más tarde'
      });
    }
  }

  const { mutateAsync: addCourseMutation } = useMutation({
    mutationFn: addCourse,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['courses'] })
    }
  });

  if (showLoginMessage) {
    return (
      <div className={'flex flex-col min-h-screen'}>
        <div className={'flex-grow flex flex-col justify-center items-center'}>
          <div className={'justify-center gap-2 border-2 rounded-md w-[330px] h-[100px] px-2.5 py-1.5'}>
            <p className={'text-center font-bold text-3xl mb-3'}>⚠️ Inicia sesión ⚠️</p>
            <p className={'text-base'}>Redirigiendo a la página de Log In <b>...</b></p>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  const onSubmit: SubmitHandler<CourseCreate> = async (data) => {
    const formattedData = {
      ...data,
      startDate: startDate || null,
      endDate: endDate || null,
    };
    await addCourseMutation(formattedData);
    reset();
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return (
    <div className="container mx-auto pb-8 max-w-4xl sm:px-6 lg:px-0 px-6 sm:pt-2 lg:pt-0 pt-2">
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-base">Nombre del curso</Label>
              <Input id="name" {...register("name", {required: "Este campo es requerido"})}
                     className="mt-1 dark:bg-gray-700 dark:text-white"
                     placeholder="Ingrese un nombre para el curso"
              />
              {errors.name && <p className="text-red-500 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="university" className="text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-base">Universidad</Label>
              <Input id="university" {...register("university", {required: "Este campo es requerido"})}
                     className="mt-1 dark:bg-gray-700 dark:text-white"
                     placeholder="Ingrese el nombre de la university"
              />
              {errors.university && <p className="text-red-500 mt-1">{errors.university.message}</p>}
            </div>
            <div>
              <Label htmlFor="schedule" className="text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-base">Régimen</Label>
              <Input id="schedule" {...register("schedule", {required: "Este campo es requerido"})}
                     className="mt-1 dark:bg-gray-700 dark:text-white"
                     placeholder="Ingrese el régimen del curso. Ejm: Régimen Sierra"
              />
              {errors.schedule && <p className="text-red-500 mt-1">{errors.schedule.message}</p>}
            </div>
          </div>
          <div>
            <Label className="text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-base">Fecha de inicio</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !startDate && "text-muted-foreground",
                    "dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4"/>
                  {startDate ? format(startDate, "dd 'de' MMMM 'de' yyyy", { locale: es }) : <span className={'dark:text-gray-200'}>Selecciona una fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 dark:bg-gray-800 dark:border-gray-700">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => {
                    setStartDate(date)
                    register("startDate").onChange({target: {value: date}})
                      .then(() => {
                      console.log("Fecha actualizada correctamente.");
                    })
                      .catch((error) => {
                        console.error("Error al actualizar la fecha:", error);
                      });
                  }}
                  initialFocus
                  className="dark:bg-gray-800 dark:text-gray-200"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label className="text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-base">Fecha de finalización</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !endDate && "text-muted-foreground",
                    "dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4"/>
                  {endDate ? format(endDate, "dd 'de' MMMM 'de' yyyy", { locale: es }) : <span className={'dark:text-gray-200'}>Selecciona una fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 dark:bg-gray-800 dark:border-gray-700">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => {
                    setEndDate(date)
                    register("endDate").onChange({target: {value: date}})
                      .then(() => {
                      console.log("Fecha actualizada correctamente.");
                    })
                      .catch((error) => {
                        console.error("Error al actualizar la fecha:", error);
                      });
                  }}
                  initialFocus
                  className="dark:bg-gray-800 dark:text-gray-200"
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="cost" className="text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-base">Costo</Label>
            <Input id="cost" type="number" {...register("cost", {required: "Este campo es requerido"})}
                   className="mt-1 dark:bg-gray-700 dark:text-white"
                   min="1"
                   placeholder="Ingrese un costo para el curso. Ejm: 399.99"
            />
            {errors.cost && <p className="text-red-500 mt-1">{errors.cost.message}</p>}
          </div>
          <div>
            <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300 text-sm sm:text-base md:text-base">Teléfono</Label>
            <Input id="phone" {...register("phone", {required: "Este campo es requerido"})}
                   className="mt-1 dark:bg-gray-700 dark:text-white"
                   placeholder="Ingrese un número de teléfono para el curso"
            />
            {errors.phone && <p className="text-red-500 mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <Label className="text-gray-700 dark:text-gray-300 mr-2 text-sm sm:text-base md:text-base">Opciones de pago</Label>
            {paymentFields.map((field, index) => (
              <div key={field.id} className="flex items-center mt-2">
                <Input
                  {...register(`paymentOptions.${index}` as const, {required: "Este campo es requerido"})}
                  className="dark:bg-gray-700 dark:text-white"
                  placeholder="Ingrese una opción de pago"
                />
                <Button type="button" variant="ghost" size="sm" onClick={() => removePayment(index)}><X
                  className="h-4 w-4"/></Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendPayment('')}
              className="mt-2 mr-4 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              <PlusCircle className="h-4 w-4 mr-2"/>
              Agregar opción de pago
            </Button>
          </div>
          <div>
            <Label className="text-gray-700 dark:text-gray-300 mr-2 text-sm sm:text-base md:text-base">Temario</Label>
            {syllabusFields.map((field, index) => (
              <div key={field.id} className="flex items-center mt-2">
                <Input
                  {...register(`syllabus.${index}` as const, {required: "Este campo es requerido"})}
                  className="dark:bg-gray-700 dark:text-white"
                  placeholder="Ingrese un tema del temario"
                />
                <Button type="button" variant="ghost" size="sm" onClick={() => removeSyllabus(index)}><X
                  className="h-4 w-4"/></Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendSyllabus('')}
              className="mt-2 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              <PlusCircle className="h-4 w-4 mr-2"/>
              Agregar tema
            </Button>
          </div>
          <div>
            <Label className="text-gray-700 dark:text-gray-300 mr-2 text-sm sm:text-base md:text-base">Beneficios</Label>
            {benefitFields.map((field, index) => (
              <div key={field.id} className="flex items-center mt-2">
                <Input
                  {...register(`benefits.${index}` as const, {required: "Este campo es requerido"})}
                  className="dark:bg-gray-700 dark:text-white"
                  placeholder="Ingrese un beneficio"
                />
                <Button type="button" variant="ghost" size="sm" onClick={() => removeBenefit(index)}><X
                  className="h-4 w-4"/></Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendBenefit('')}
              className="mt-2 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              <PlusCircle className="h-4 w-4 mr-2"/>
              Agregar beneficio
            </Button>
          </div>
          <div>
            <Label className="text-gray-700 dark:text-gray-300 mr-2 text-sm sm:text-base md:text-base">Horarios presenciales</Label>
            {inPersonScheduleFields.map((field, index) => (
              <div key={field.id} className="flex items-center mt-2">
                <Input
                  {...register(`inPersonSchedules.${index}` as const, {required: "Este campo es requerido"})}
                  className="dark:bg-gray-700 dark:text-white"
                  placeholder="Ingrese un horario presencial específico"
                />
                <Button type="button" variant="ghost" size="sm" onClick={() => removeInPersonSchedule(index)}><X
                  className="h-4 w-4"/></Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendInPersonSchedule('')}
              className="mt-2 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              <PlusCircle className="h-4 w-4 mr-2"/>
              Agregar horario
            </Button>
          </div>
          <div>
            <Label className="text-gray-700 dark:text-gray-300 mr-2 text-sm sm:text-base md:text-base">Horarios virtuales</Label>
            {virtualScheduleFields.map((field, index) => (
              <div key={field.id} className="flex items-center mt-2">
                <Input
                  {...register(`virtualSchedules.${index}` as const, {required: "Este campo es requerido"})}
                  className="dark:bg-gray-700 dark:text-white"
                  placeholder="Ingrese un horario virtual específico"
                />
                <Button type="button" variant="ghost" size="sm" onClick={() => removeVirtualSchedule(index)}><X
                  className="h-4 w-4"/></Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendVirtualSchedule('')}
              className="mt-2 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
            >
              <PlusCircle className="h-4 w-4 mr-2"/>
              Agregar horario
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
          <Button type="submit"
                  className="text-sm sm:text-base md:text-base bg-button-color hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-full mt-2 transition-colors ease-in-out duration-200">Guardar
            Curso</Button>
        </div>
      </form>
    </div>
  )
}
