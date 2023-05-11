import { Container, TopLeft, BottomLeft, BottomRight, Hamburger } from './styles'

export default function Overlay() {
  return (
    <Container>
      <TopLeft>
        <h1>
          OFF —
          <br />
          SCREEN
        </h1>
        <p>In React & Threejs.</p>
      </TopLeft>
      <BottomLeft>
        Run Threejs in a worker via{' '}
        <a href="https://github.com/pmndrs/react-three-offscreen">pmndrs/react-three-offscreen</a>
      </BottomLeft>
      <BottomRight>
        <h4>What's the big deal, workers existed before</h4>
        <p>
          You only could never just run your existing WebGL/Threejs app in it. It had to be rewritten.
          Pointer-events wouldn't work, controls, textures, GLTFs, etc. Worse, thanks to Safari you
          needed to maintain two forks of your app, one that runs in a worker and one that runs on the main thread as a
          fallback. Rt/offscreen attempts to fix that!
        </p>
      </BottomRight>
      <Hamburger>
        <div />
        <div />
        <div />
      </Hamburger>
    </Container>
  )
}
