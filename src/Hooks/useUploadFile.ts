import { awsService } from '@/Services/aws.service'
import { useState } from 'react'

export const useUploadFile = (bucketName: string) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const uploadAsync = async (file: {
    uri: string
    mimeType: string
    name: string
  }): Promise<string> => {
    setIsLoading(true)

    const response = await fetch(file.uri)
    const blob = await response.blob()

    const params = {
      Bucket: bucketName,
      Key: new Date().getTime() + '-' + file.name,
      Body: blob,
      ContentType: file.mimeType,
    }

    const promise = new Promise<string>(async (resolve, reject) => {
      await awsService.s3
        .upload(params)
        .promise()
        .then(data => {
          console.log('File uploaded successfully:', data.Location)

          setIsLoading(false)
          resolve(data.Location)
        })
        .catch(err => {
          console.log('Error uploading file:', err)

          setIsLoading(false)
          reject(new Error('Error uploading file to S3'))
        })
    })

    return promise
  }

  return { uploadAsync, isLoading }
}
