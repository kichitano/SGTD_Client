export interface CountryModel {
    code: string,
    name: string
}

export interface ErrorMessages {
    [key: number]: string;
}

export const ERROR_MESSAGES: ErrorMessages = {
    400: 'Error en la solicitud',
    401: 'No tiene autorización para realizar esta operación',
    403: 'No tiene permisos para realizar esta operación',
    404: 'Recurso no encontrado',
    500: 'Error al realizar operación, contacte con el administrador'
};