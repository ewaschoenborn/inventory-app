import * as yup from 'yup';

export interface ILabel {
    id: string;
    name: string;
    color: string;
}

export const LabelValidationSchema = yup.object().shape({
    id: yup.string().required('ID ist erforderlich.').min(1, 'ID darf nicht leer sein.'),
    name: yup.string().required('Name ist erforderlich.').min(1, 'Name darf nicht leer sein.'),
    color: yup.string().required('Farbe ist erforderlich.').min(1, 'Farbe darf nicht leer sein.'),
});
