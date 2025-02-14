import { Tile, type TileData } from "./tile"

const tiles: TileData[] = [
  { title: "Bank", href: "/tickets/bank", color: "blue", openInNewTab: true },
  { title: "Directed Pay", href: "/tickets/directed-pay", color: "green", openInNewTab: true },
  { title: "SSO/API", href: "/tickets/sso-api", color: "purple", openInNewTab: true },
  { title: "Commercial Pay", href: "/tickets/commercial-pay", color: "indigo", openInNewTab: true },
  { title: "Commercial Provider", href: "/tickets/commercial-provider", color: "teal", openInNewTab: true },
  { title: "Data Engineering", href: "/tickets/data-engineering", color: "yellow", openInNewTab: true },
  { title: "HBA", href: "/tickets/hba", color: "blue", openInNewTab: true },
  { title: "CAMS/RRA", href: "/tickets/cams-rra", color: "purple", openInNewTab: true },
  { title: "Tools", href: "/tickets/tools", color: "teal", openInNewTab: true },
  { title: "Platform", href: "/tickets/platform", color: "indigo", disabled: true, openInNewTab: true },
  { title: "Phoenix Team", href: "/tickets/phoenix-team", color: "red", openInNewTab: true },
  { title: "Test", href: "https://www.youtube.com/watch?v=t70Olses-MU", color: "gray", openInNewTab: true },
]

export function TileGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {tiles.map((tile) => (
        <Tile key={tile.title} {...tile} />
      ))}
    </div>
  )
}

