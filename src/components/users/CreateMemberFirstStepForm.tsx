import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useClubIdStore, useCreateUserStore, useMembershipStore, useUserStore } from "../../store/store";
import AxiosInstance from "../../config/axios";
import type { MembershipResponse, MembershipType, UserResponse } from "../../entities/Entities";
import { useNavigate } from "react-router-dom";
import { useMembershipTypeStore } from "../../store/store";

const formSchema = z.object({
  name: z.string().min(1),
  typeId: z.number().min(1, 'Seleccioná un tipo de usuario'),
  email: z.string().email(),
  document: z.string().min(1, 'El documento es requerido'),
});

export default function CreateMemberFirstStepForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            typeId: 2,
            name: '',
            email: '',
            document: '',
        },
    });
    const navigate = useNavigate();
    const membershipTypes: MembershipType[] = useMembershipTypeStore((state) => state.membershipTypes);
    useEffect(() => {
            const contenedor = document.getElementById('Contenedor');
            if (!contenedor) return;
            contenedor.innerHTML = '';
            const div = document.createElement('div');
            div.className = 'space-y-1.5';
            const label = document.createElement('label');
            label.htmlFor = 'membershipTypeId';
            label.className = 'block text-sm font-medium text-slate-700';
            label.textContent = 'Tipo de membresía';
            const select = document.createElement('select');
            select.id = 'membershipTypeId';
            select.classList.add('w-full', 'rounded-md', 'border', 'border-slate-300', 'bg-white', 'px-3', 'py-2', 'text-sm', 'text-slate-900', 'shadow-sm', 'outline-none', 'transition', 'focus:border-slate-500', 'focus:ring-2', 'focus:ring-slate-200');
            select.options.add(new Option('Seleccione un tipo de membresía', '0'));
            membershipTypes.forEach(membershipType => {
                select.options.add(new Option(membershipType.name, String(membershipType.id)));
            });
            div.appendChild(label);
            div.appendChild(select);
            contenedor.appendChild(div);
    }, [membershipTypes]);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        console.log(data);
        const membershipEl = document.getElementById('membershipTypeId');
        const membership =
            membershipEl instanceof HTMLSelectElement ? Number(membershipEl.value) || 0 : 0;
        const user = {
            name: data.name,
            typeId: data.typeId,
            email: data.email,
            isActive: true,
            document: data.document,
            membership,
        }
        try{
            if(user.typeId === 2){ //suponemos es member el segundo tipo
                useCreateUserStore.getState().setFirstStep({
                    ...user,
                    clubId: useClubIdStore.getState().clubId,
                });
                if(user.typeId !== 3){
                    try{
                        const userToSend = {
                            name: data.name,
                            typeId: data.typeId,
                            email: data.email,
                            isActive: true,
                            document: data.document,
                            clubId: useClubIdStore.getState().clubId,
                        }
                        const response = await AxiosInstance.post<UserResponse>("/users", userToSend);
                        if(response){
                            const userRes : UserResponse = response.data;
                            try{
                                const response = await AxiosInstance.post("/membership", {
                                    userId: userRes.id,
                                    type: user.membership,
                                    clubId: useClubIdStore.getState().clubId,
                                });
                                if(response){
                                    const membershipRes : MembershipResponse = response.data;
                                    if(membershipRes.id){
                                        userRes.membership?.push(membershipRes);
                                        useUserStore.getState().setUser(userRes);
                                        useMembershipStore.getState().setMembership(membershipRes);
                                        navigate('/miembros')
                                    }else{
                                        useUserStore.getState().deleteUser(userRes.id, userRes.clubId);
                                        AxiosInstance.delete(`/users/${userRes.id}`, {
                                            data: {
                                                id: userRes.id,
                                                clubId: userRes.clubId,
                                            },
                                        });
                                        throw new Error("Error al crear la membresía");
                                    }
                                }else{
                                    useUserStore.getState().deleteUser(userRes.id, userRes.clubId);
                                    AxiosInstance.delete(`/users/${userRes.id}`, {
                                        data: {
                                            id: userRes.id,
                                            clubId: userRes.clubId,
                                        },
                                    });
                                    throw new Error("Error al crear la membresía");
                                }
                            }catch(error){
                                alert("Error al crear la membresía");
                                console.error(error);
                            }
                        }else{
                            throw new Error("Error al crear el usuario");
                        }
                    }catch(error){
                        alert("Error al crear la membresía");
                        console.error(error);
                    }
                }else if(user.typeId === 3){
                    useCreateUserStore.getState().setFirstStep({
                        ...user,
                        membership: user.membership,
                        clubId: useClubIdStore.getState().clubId,
                    });
                    navigate('/socios/crear/paso-especifico-atleta')
                }
            }
            else{
                return;
            }
        }catch(error){
            alert(error);
            console.error(error);
        }
    };

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
                Crear Socio
            </button>
        </form>
        </div>
    );
}
