import React, {useState, useRef, useEffect} from 'react'
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form'
import {useMutation, useQueryClient} from '@tanstack/react-query'
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
import { CourseCreate } from '@/interfaces/Course'
import { axiosInstance } from "@/lib/axios"
import toast from "react-hot-toast"
import { AxiosError } from "axios"
import {useRouter} from "next/navigation";
import {useAuthStore} from "@/store/auth";

export default function CourseForm() {
  const { register, control, handleSubmit, formState: { errors } } = useForm<CourseCreate>({
    defaultValues: {
      name: '',
      university: '',
      schedule: '',
      startDate: null,
      endDate: null,
      cost: 0,
      phone: '',
      paymentOptions: [''],
      syllabus: [''],
      benefits: [''],
      schedules: [''],
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

  const { fields: scheduleFields, append: appendSchedule, remove: removeSchedule } = useFieldArray({
    control,
    name: "schedules",
  });

  const router = useRouter();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const userAuth = useAuthStore((state) => state.userAuth);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  const [showLoginMessage, setShowLoginMessage] = useState(false);

  const [course, setCourse] = useState<CourseCreate>({
    name: '',
    university: '',
    schedule: '',
    startDate: null,
    endDate: null,
    cost: 0,
    phone: '',
    paymentOptions: [''],
    syllabus: [''],
    benefits: [''],
    schedules: [''],
  })

  const resetForm = () => {
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
      phone: '',
      paymentOptions: [''],
      syllabus: [''],
      benefits: [''],
      schedules: ['']
    });
  };

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
      await axiosInstance.post('/course/create-course', data);
      toast.success("Curso creado con éxito!");
      resetForm()
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error?.response?.status === 400) {
          const errors = error?.response?.data.errors;
          const errorApi = error?.response?.data.error;

          if (Array.isArray(errors)) {
            const errorsMessages = errors
              .map((errorMessage: { message: string }) => errorMessage?.message)
              .join('\n');

            return toast.error(errorsMessages);
          }

          return toast.error(errorApi.message);
        }

        if (error?.response?.status === 409) {
          return toast.error('El curso ya existe');
        }
      }
      toast.error('Ocurrió un error inesperado, inténtelo nuevamente más tarde');
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
    resetForm();
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return (
    <div className="container mx-auto pb-8 max-w-4xl">
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Nombre del curso</Label>
              <Input id="name" {...register("name", {required: "Este campo es requerido"})}
                     className="mt-1 dark:bg-gray-700 dark:text-white"
                     placeholder="Ingrese un nombre para el curso"
              />
              {errors.name && <p className="text-red-500 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="university" className="text-gray-700 dark:text-gray-300">Universidad</Label>
              <Input id="university" {...register("university", {required: "Este campo es requerido"})}
                     className="mt-1 dark:bg-gray-700 dark:text-white"
                     placeholder="Ingrese el nombre de la university"
              />
              {errors.university && <p className="text-red-500 mt-1">{errors.university.message}</p>}
            </div>
            <div>
              <Label htmlFor="schedule" className="text-gray-700 dark:text-gray-300">Régimen</Label>
              <Input id="schedule" {...register("schedule", {required: "Este campo es requerido"})}
                     className="mt-1 dark:bg-gray-700 dark:text-white"
                     placeholder="Ingrese el régimen del curso. Ejm: Régimen Sierra"
              />
              {errors.schedule && <p className="text-red-500 mt-1">{errors.schedule.message}</p>}
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
                  onSelect={(date) => {
                    setStartDate(date)
                    register("startDate").onChange({target: {value: date}})
                  }}
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
                  onSelect={(date) => {
                    setEndDate(date)
                    register("endDate").onChange({target: {value: date}})
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="cost" className="text-gray-700 dark:text-gray-300">Costo</Label>
            <Input id="cost" type="number" {...register("cost", {required: "Este campo es requerido"})}
                   className="mt-1 dark:bg-gray-700 dark:text-white"
                   min="1"
                   placeholder="Ingrese un costo para el curso. Ejm: 399.99"
            />
            {errors.cost && <p className="text-red-500 mt-1">{errors.cost.message}</p>}
          </div>
          <div>
            <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">Teléfono</Label>
            <Input id="phone" {...register("phone", {required: "Este campo es requerido"})}
                   className="mt-1 dark:bg-gray-700 dark:text-white"
                   placeholder="Ingrese un número de teléfono para el curso"
            />
            {errors.phone && <p className="text-red-500 mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <Label className="text-gray-700 dark:text-gray-300 mr-2">Opciones de pago</Label>
            {paymentFields.map((field, index) => (
              <div key={field.id} className="flex items-center mt-2">
                <Input
                  {...register(`paymentOptions.${index}` as const, {required: "Este campo es requerido"})}
                  className="dark:bg-gray-700 dark:text-white"
                  placeholder="Ingrese una opción de pago"
                />
                <Button type="button" variant="ghost" size="sm" onClick={() => removePayment(index)}><X className="h-4 w-4"/></Button>
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
                  {...register(`syllabus.${index}` as const, {required: "Este campo es requerido"})}
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
                  {...register(`benefits.${index}` as const, {required: "Este campo es requerido"})}
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
                  {...register(`schedules.${index}` as const, {required: "Este campo es requerido"})}
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
          <Button type="submit" className="bg-button-color hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-full mt-2 transition-colors ease-in-out duration-200">Guardar Curso</Button>
        </div>
      </form>
    </div>
  )
}