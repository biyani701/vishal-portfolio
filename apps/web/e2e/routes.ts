// Every route the matrix visits. Each phase appends the routes it adds (P3 adds 404 and redirects, P6+ the sections).
export interface MatrixRoute {
  path: string
  name: string
}

export const routes: MatrixRoute[] = [{ path: '/', name: 'home' }]
