import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useClubIdStore, useCreateUserStore } from "../../store/store";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  name: z.string().min(1),
  typeId: z.number().min(1, 'Seleccioná un tipo de usuario'),
  email: z.string().email(),
  document: z.string().min(1, 'El documento es requerido'),
});

export default function CreateWorkerFirstStepForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            typeId: 1,
            name: '',
            email: '',
            document: '',
        },
    });
    const navigate = useNavigate();

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log(data);
        const user = {
            name: data.name,
            typeId: data.typeId,
            email: data.email,
            isActive: true,
            document: data.document,
        }
        try{
            if(user.typeId === 1){ //suponemos es worker el primer tipo
                useCreateUserStore.getState().setFirstStep({
                    ...user,
                    clubId: useClubIdStore.getState().clubId,
                });
                console.log('primer paso seteado ', useCreateUserStore.getState().firstStep);
                navigate('/trabajadores/crear/paso-especifico-trabajador')
            }
            else{
                return;
            }
        }catch(error){
            alert(error);
            console.error(error);
        }
    }

    return (
        <div className="mx-auto w-full max-w-2xl">
        <form id="createUserFirstStepForm" onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
            <input type="hidden" {...register("typeId", { valueAsNumber: true })} />
            <div className="space-y-1.5">
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">Nombre</label>
                <input
                    id="name"
                    type="text"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    {...register("name")}
                />
                {errors.name && <span className="text-sm text-red-600">{errors.name.message}</span>}
            </div>
            <div className="space-y-1.5">
                <label htmlFor="document" className="block text-sm font-medium text-slate-700">Documento</label>
                <input
                    id="document"
                    type="text"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    {...register("document")}
                />
                {errors.document && <span className="text-sm text-red-600">{errors.document.message}</span>}
            </div>
            <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                <input
                    id="email"
                    type="email"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    {...register("email")}
                />
                {errors.email && <span className="text-sm text-red-600">{errors.email.message}</span>}
            </div>
          <div id="Contenedor">
        </div>
            <button
                type="submit"
                className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
                Siguiente
            </button>
        </form>
        </div>
    );
}
