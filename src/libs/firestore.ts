import { Firestore } from '@google-cloud/firestore'

export const firestore = new Firestore({ keyFilename: 'serviceaccountkey.json' })
