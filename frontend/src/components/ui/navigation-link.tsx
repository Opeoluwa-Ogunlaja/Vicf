import { cn } from '@/lib/utils'
import { NavLink } from 'react-router-dom'
import { ReactNode } from 'react'

export const NavigationLink = ({
  className,
  to,
  children
}: {
  className?: string
  to: string
  children: ReactNode
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn('nav-link relative', className, { 'active font-bold': isActive })
      }
    >
      {children}
    </NavLink>
  )
}
