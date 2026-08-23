import { useEffect, useState } from 'react'
import type { AssetType, PriceSourceConfig, PriceSources } from '../types'
import { loadPriceSources, savePriceSources } from '../utils/storage'

export function usePriceSources() {
  const [priceSources, setPriceSources] = useState<PriceSources>(() =>
    loadPriceSources(),
  )

  useEffect(() => {
    savePriceSources(priceSources)
  }, [priceSources])

  function setPriceSource(assetType: AssetType, config: PriceSourceConfig) {
    setPriceSources((prev) => ({ ...prev, [assetType]: config }))
  }

  function deletePriceSource(assetType: AssetType) {
    setPriceSources((prev) => {
      const next = { ...prev }
      delete next[assetType]
      return next
    })
  }

  return { priceSources, setPriceSource, deletePriceSource }
}
