import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useClubIdStore, useCreateUserStore, useMembershipStore, useUserStore } from "../../store/store";
import AxiosInstance from "../../config/axios";
import type { MembershipResponse, MembershipType, UserResponse } from "../../entities/Entities";
import { useUserTypeStore } from "../../store/store";
import type { UserType } from "../../entities/Entities";
import { useNavigate } from "react-router-dom";
import { useMembershipTypeStore } from "../../store/store";

const formSchema = z.object({
  name: z.string().min(1),
  typeId: z.number().min(1, 'Seleccioná un tipo de usuario'),
  email: z.string().email(),
  membershipType: z.number().min(1, 'Seleccioná un tipo de membresía'),
  document: z.string().min(1, 'El documento es requerido'),
});

export default function CreateUserFirstStepForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });
    const navigate = useNavigate();
    const userTypes: UserType[] = useUserTypeStore((state) => state.userTypes);
    const membershipTypes: MembershipType[] = useMembershipTypeStore((state) => state.membershipTypes);
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        debugger;
        console.log(data);
        const user = {
            name: data.name,
            typeId: data.typeId,
            email: data.email,
            isActive: true,
            membership: data.membershipType,
            document: data.document,
        }
        try{
            if(user.typeId === 0){
                throw new Error("Seleccioná un tipo de usuario");
            }
            if(data.membershipType === 0){
                throw new Error("Seleccioná un tipo de membresía");
            }
            if(user.typeId === 1){ //suponemos es worker el primer tipo
                useCreateUserStore.getState().setFirstStep({
                    ...user,
                    clubId: useClubIdStore.getState().clubId,
                });
                console.log('primer paso seteado ', useCreateUserStore.getState().firstStep);
                navigate('/usuarios/crear/paso-especifico-trabajador')
            }
            if(user.typeId === 2){ //suponemos es member el segundo tipo
                useCreateUserStore.getState().setFirstStep({
                    ...user,
                    clubId: useClubIdStore.getState().clubId,
                });
                if(data.membershipType === 1 || data.membershipType === 2){
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
                            useUserStore.getState().setUser(userRes);
                            try{
                                const response = await AxiosInstance.post("/membership", {
                                    userId: userRes.id,
                                    type: data.membershipType,
                                    clubId: useClubIdStore.getState().clubId,
                                });
                                if(response){
                                    const membershipRes : MembershipResponse = response.data;
                                    useMembershipStore.getState().setMembership(membershipRes);
                                    if(membershipRes.id){
                                        navigate('/usuarios')
                                    }else{
                                        useUserStore.getState().deleteUser(userRes.id);
                                        AxiosInstance.delete(`/users/${userRes.id}`);
                                        throw new Error("Error al crear la membresía");
                                    }
                                }else{
                                    useUserStore.getState().deleteUser(userRes.id);
                                    AxiosInstance.delete(`/users/${userRes.id}`);
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
                }else if(data.membershipType === 3){
                    useCreateUserStore.getState().setFirstStep({
                        ...user,
                        membership: data.membershipType,
                        clubId: useClubIdStore.getState().clubId,
                    });
                    navigate('/usuarios/crear/paso-especifico-atleta')
                }
            }
        }catch(error){
            alert(error);
            console.error(error);
        }
    };

    return (
        <div className="mx-auto w-full max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
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
                <label htmlFor="typeId" className="block text-sm font-medium text-slate-700">Tipo de usuario</label>
                <select
                    id="typeId"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    {...register("typeId", { valueAsNumber: true })}
                >
                    <option value={0}>Seleccione un tipo de usuario</option>
                    {userTypes.map((userType) => (
                        <option key={userType.id} value={userType.id}>{userType.name}</option>
                    ))}
                </select>
                {errors.typeId && <span className="text-sm text-red-600">{errors.typeId.message}</span>}
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
            <div className="space-y-1.5">
                <label htmlFor="membershipType" className="block text-sm font-medium text-slate-700">Tipo de membresía</label>
                <select
                    id="membershipType"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    {...register("membershipType", { valueAsNumber: true })}
                >
                    <option value={0}>Seleccione un tipo de membresía</option>
                    {membershipTypes.map((membershipType) => (
                        <option key={membershipType.id} value={membershipType.id}>{membershipType.name}</option>
                    ))}
                </select>
                {errors.membershipType && <span className="text-sm text-red-600">{errors.membershipType.message}</span>}
            </div>
            <button
                type="submit"
                className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
                Crear usuario
            </button>
        </form>
        </div>
    );
}
