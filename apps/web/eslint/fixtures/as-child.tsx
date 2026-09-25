const Trigger = (props: { asChild?: boolean; children: React.ReactNode }) => <>{props.children}</>

export const Fixture = () => (
  <Trigger asChild>
    <a href="/">Home</a>
  </Trigger>
)
