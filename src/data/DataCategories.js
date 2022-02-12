import { addColorsToArray } from 'utils/ColorUtils';

export function getCategory(categoryId) {
    return getCategories().find(category => category.id === categoryId);
}

export function getCategories() {
    return addColorsToArray([
        {
            id: 'E_COUT_HEBERGEMENT_MAISON_DE_REPOS_OU_DE_SOINS',
            title: 'Coût hébergement maison de repos ou de soins',
            type: 'expenses'
        },
        {
            id: 'E_COUT_DU_LOGEMENT',
            title: 'Coût du logement',
            type: 'expenses'
        },
        {
            id: 'E_FRAIS_ENTRETIEN_OU_DE_REPARATION_BIEN_IMMOBILIER',
            title: 'Frais d\'entretien ou de réparation bien immobilier',
            type: 'expenses'
        },
        {
            id: 'E_FRAIS_DE_SERVICES_UTILITE_PUBLIQUE',
            title: 'Frais de services d\'utilité publique',
            type: 'expenses'
        },
        {
            id: 'E_FRAIS_PERSONNELS',
            title: 'Frais personnels',
            type: 'expenses'
        },
        {
            id: 'E_SOMMES_MIS_A_DISPOSITION_DE_LA_PERSONNE_PROTEGEE_PAR_ADMINISTRATEUR',
            title: 'Sommes mis à disposition de la personne protégée par l\'administrateur',
            type: 'expenses'
        },
        {
            id: 'E_DEPENSES_FISCALES',
            title: 'Dépenses fiscales',
            type: 'expenses'
        },
        {
            id: 'E_REMBOURSEMENT_EMPRUNTS_ET_REMBOURSEMENT_DE_DETTES',
            title: 'Remboursement emprunts et remboursement de dettes',
            type: 'expenses'
        },
        {
            id: 'E_FRAIS_DE_MOBILITE',
            title: 'Frais de mobilité',
            type: 'expenses'
        },
        {
            id: 'E_PRIMES_ASSURANCE',
            title: 'Primes d\'assurance',
            type: 'expenses'
        },
        {
            id: 'E_FRAIS_MEDICAUX_ET_PARAMEDICAUX_COTISATIONS_MUTUELLE',
            title: 'Frais médicaux et paramédicaux / cotisations mutuelle',
            type: 'expenses'
        },
        {
            id: 'E_DEPENSES_POUR_LES_ENFANTS_DE_LA_PERSONNE_PROTEGEE',
            title: 'Dépenses pour les enfants de la personne protégée',
            type: 'expenses'
        },
        {
            id: 'E_DONATIONS_CADEAUX',
            title: 'Donations / cadeaux',
            type: 'expenses'
        },
        {
            id: 'E_REMUNERATION_DE_ADMINISTRATEUR',
            title: 'Rémunération de l\'administrateur',
            type: 'expenses'
        },
        {
            id: 'E_TRANSFERTS',
            title: 'Transferts',
            type: 'expenses'
        },
        {
            id: 'E_AUTRES_DEPENSES',
            title: 'Autres dépenses',
            type: 'expenses'
        },
        {
            id: 'I_REVENUS_DU_TRAVAIL',
            title: 'Revenus du travail',
            type: 'income'
        },
        {
            id: 'I_PENSIONS',
            title: 'Pensions',
            type: 'income'
        },
        {
            id: 'I_INDEMNITE_DE_CHOMAGE_INDEMNITE_CAISSE_ASSURANCE_MALADIE',
            title: 'Indemnité de chômage / indemnité caisse d\'assurance maladie',
            type: 'income'
        },
        {
            id: 'I_ALLOCATIONS_FAMILIALES_PERSONNELLES_ALIMENTS',
            title: 'Allocations familiales personnelles / aliments',
            type: 'income'
        },
        {
            id: 'I_ALLOCATIONS_FAMILIALES_CONTRIBUTION_ALIMENTAIRES_POUR_LES_ENFANTS_DE_LA_PERSONNE_PROTEGEE',
            title: 'Allocations familiales / contribution alimentaires pour les enfants de la personne protégée',
            type: 'income'
        },
        {
            id: 'I_ALLOCATIONS_POUR_PERSONNES_HANDICAPEES',
            title: 'Allocations pour personnes handicapées',
            type: 'income'
        },
        {
            id: 'I_ALLOCATIONS_SOCIALES',
            title: 'Allocations sociales',
            type: 'income'
        },
        {
            id: 'I_REMBOURSEMENTS_MUTUELLE',
            title: 'Remboursements mutuelle',
            type: 'income'
        },
        {
            id: 'I_LOYERS_ET_FERMAGES',
            title: 'Loyers et fermages',
            type: 'income'
        },
        {
            id: 'I_REMBOURSEMENTS_IMPOTS',
            title: 'Remboursements impôts',
            type: 'income'
        },
        {
            id: 'I_INTERETS',
            title: 'Intérêts',
            type: 'income'
        },
        {
            id: 'I_PLUS_VALUES_EFFECTIVEMENT_REALISEES_SUR_DES_PRODUITS_INVESTISSEMENT',
            title: 'Plus values effectivement réalisées sur des produits d\'investissement',
            type: 'income'
        },
        {
            id: 'I_DONATIONS_RECUES_CADEAUX_SUCCESSIONS_RECUS',
            title: 'Donations reçues / cadeaux / successions reçus',
            type: 'income'
        },
        {
            id: 'I_AUTRES_REVENUS',
            title: 'Autre revenus',
            type: 'income'
        }
    ]);
}