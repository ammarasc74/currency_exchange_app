import { useEffect, useState } from 'react'
import { PERMISSIONS, requestMultiple } from 'react-native-permissions'
import Geolocation from '@react-native-community/geolocation'
import { Platform } from 'react-native'
import Geocoder from 'react-native-geocoding'

export const requestLocationPermission = async () => {
  return requestMultiple([
    PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  ])
}

export const useCurrentLocation = () => {
  const [location, setLocation] = useState<{
    latitude: number
    longitude: number
  }>()
  const [isPermissionGranted, setIsPermissionGranted] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [city, setCity] = useState<string>()

  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        const response = await requestLocationPermission()

        const isAndroidPermissionGranted =
          response['android.permission.ACCESS_FINE_LOCATION'] === 'granted'
        const isIosPermissionGranted =
          response['ios.permission.LOCATION_WHEN_IN_USE'] === 'granted'

        const isPermissionGranted = Platform.select({
          android: isAndroidPermissionGranted,
          ios: isIosPermissionGranted,
        })

        if (!isPermissionGranted) {
          return setIsLoading(false)
        }

        Geolocation.getCurrentPosition(async pos => {
          setIsPermissionGranted(true)

          const coordinates = pos.coords

          setLocation({
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
          })

          try {
            const response = await Geocoder.from({
              latitude: coordinates.latitude,
              longitude: coordinates.latitude,
            })

            const cityObject = response.results
              .find(item =>
                item.types.find(
                  i => i === 'locality' || i === 'administrative_area_level_1',
                ),
              )
              ?.address_components.find(item => {
                return item.types.find(
                  i => i === 'locality' || i === 'administrative_area_level_1',
                )
              })

            setCity(cityObject?.short_name)

            setIsLoading(false)
          } catch (e) {
            setIsLoading(false)

            console.log(e)
          }
        })
      } catch (e) {
        setIsLoading(false)

        console.log(e)
      }
    }

    getCurrentLocation()
  }, [])

  return { location, isPermissionGranted, isLoading, city }
}
