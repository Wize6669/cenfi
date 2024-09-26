import React, { useState } from 'react'
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form'
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
import { Course } from '@/interfaces/Course'

export default function CourseForm() {
  const { register, control, handleSubmit, formState: { errors } } = useForm<Course>({
    defaultValues: {
      paymentOptions: [{ method: '' }],
      syllabus: [{ topic: '' }],
      benefits: [{ description: '' }],
      schedules: [{ timetable: '' }],
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



  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)

  const onSubmit: SubmitHandler<Course> = (data) => {
    console.log(data);
    // Aquí puedes enviar los datos a tu backend
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre del curso</Label>
            <Input id="name" {...register("name", {required: "Este campo es requerido"})} />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="university">Universidad</Label>
            <Input id="university" {...register("university", {required: "Este campo es requerido"})} />
            {errors.university && <p className="text-red-500">{errors.university.message}</p>}
          </div>
          <div>
            <Label htmlFor="schedule">Horario general</Label>
            <Input id="schedule" {...register("schedule", {required: "Este campo es requerido"})} />
            {errors.schedule && <p className="text-red-500">{errors.schedule.message}</p>}
          </div>
          <div>
            <Label>Fecha de inicio</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4"/>
                  {startDate ? format(startDate, "PPP") : <span>Selecciona una fecha</span>}
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
            <Label>Fecha de finalización</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4"/>
                  {endDate ? format(endDate, "PPP") : <span>Selecciona una fecha</span>}
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
            <Label htmlFor="cost">Costo</Label>
            <Input id="cost" type="number" {...register("cost", {required: "Este campo es requerido"})} />
            {errors.cost && <p className="text-red-500">{errors.cost.message}</p>}
          </div>
          <div>
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" {...register("phone", {required: "Este campo es requerido"})} />
            {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <Label>Opciones de pago</Label>
            {paymentFields.map((field, index) => (
              <div key={field.id} className="flex items-center mt-2">
                <Input {...register(`paymentOptions.${index}` as const, { required: "Este campo es requerido" })} />
                <Button type="button" variant="ghost" size="sm" onClick={() => removePayment(index)}><X className="h-4 w-4" /></Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => appendPayment({ method: '' })} className="mt-2">
              <PlusCircle className="h-4 w-4 mr-2" />
              Agregar opción de pago
            </Button>
          </div>
          <div>
            <Label>Temario</Label>
            {syllabusFields.map((field, index) => (
              <div key={field.id} className="flex items-center mt-2">
                <Input {...register(`syllabus.${index}` as const, { required: "Este campo es requerido" })} />
                <Button type="button" variant="ghost" size="sm" onClick={() => removeSyllabus(index)}><X className="h-4 w-4" /></Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => appendSyllabus({ topic: '' })} className="mt-2">
              <PlusCircle className="h-4 w-4 mr-2" />
              Agregar tema
            </Button>
          </div>
          <div>
            <Label>Beneficios</Label>
            {benefitFields.map((field, index) => (
              <div key={field.id} className="flex items-center mt-2">
                <Input {...register(`benefits.${index}` as const, { required: "Este campo es requerido" })} />
                <Button type="button" variant="ghost" size="sm" onClick={() => removeBenefit(index)}><X className="h-4 w-4" /></Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => appendBenefit({ description: '' })} className="mt-2">
              <PlusCircle className="h-4 w-4 mr-2" />
              Agregar beneficio
            </Button>
          </div>
          <div>
            <Label>Horarios específicos</Label>
            {scheduleFields.map((field, index) => (
              <div key={field.id} className="flex items-center mt-2">
                <Input {...register(`schedules.${index}` as const, { required: "Este campo es requerido" })} />
                <Button type="button" variant="ghost" size="sm" onClick={() => removeSchedule(index)}><X className="h-4 w-4" /></Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => appendSchedule({ timetable: '' })} className="mt-2">
              <PlusCircle className="h-4 w-4 mr-2" />
              Agregar horario
            </Button>
          </div>
        </div>
      </div>
      <Button type="submit">Guardar Curso</Button>
    </form>
  )
}
