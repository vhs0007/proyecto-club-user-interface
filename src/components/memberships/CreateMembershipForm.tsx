import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(1),
});

export default function CreateMembershipForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const onSubmit = (data: z.infer<typeof schema>) => {
    console.log(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="text" {...register('name')} placeholder="Nombre" className="form-control" />
      {errors.name && <span>{errors.name.message}</span>}
      <input type="text" {...register('description')} placeholder="Descripción" className="form-control" />
      {errors.description && <span>{errors.description.message}</span>}
      <input type="number" {...register('price')} placeholder="Precio" className="form-control" />
      {errors.price && <span>{errors.price.message}</span>}
      <button type="submit" className="btn btn-primary">Guardar</button>
    </form>
  )
}