

export const CHANGECITY = "CHANGECITY"
export function changeCity(city){
    return {
        type:CHANGECITY,
        city
    }
}