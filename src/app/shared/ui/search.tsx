'use client'

import { SearchOutlined } from '@ant-design/icons'
import { Input, InputProps, theme } from 'antd'
import { debounce } from 'lodash'
import { useMemo, useEffect } from 'react'

export function SearchInput(props: InputProps) {
  const { token } = theme.useToken()
  const { onChange, ...restProps } = props

  const debouncedOnChange = useMemo(() => {
    return debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e)
    }, 500)
  }, [onChange])

  useEffect(() => {
    return () => {
      debouncedOnChange.cancel()
    }
  }, [debouncedOnChange])

  return (
    <Input
      prefix={
        <SearchOutlined
          style={{
            color: token.colorIcon,
          }}
        />
      }
      allowClear
      onChange={debouncedOnChange}
      {...restProps}
    />
  )
}
