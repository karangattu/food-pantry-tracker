import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

describe("Card components", () => {
  it("renders Card with children", () => {
    render(<Card data-testid="card">Content</Card>);
    expect(screen.getByTestId("card")).toHaveTextContent("Content");
  });

  it("Card has proper styling", () => {
    render(<Card data-testid="card">Content</Card>);
    const card = screen.getByTestId("card");
    expect(card.className).toContain("rounded-lg");
    expect(card.className).toContain("border");
    expect(card.className).toContain("shadow");
  });

  it("renders CardHeader", () => {
    render(<CardHeader data-testid="header">Header</CardHeader>);
    expect(screen.getByTestId("header")).toHaveTextContent("Header");
  });

  it("renders CardTitle", () => {
    render(<CardTitle>Title Text</CardTitle>);
    expect(screen.getByText("Title Text")).toBeInTheDocument();
  });

  it("CardTitle has heading styling", () => {
    render(<CardTitle data-testid="title">Title</CardTitle>);
    const title = screen.getByTestId("title");
    expect(title.className).toContain("font-semibold");
  });

  it("renders CardContent", () => {
    render(<CardContent data-testid="content">Body</CardContent>);
    expect(screen.getByTestId("content")).toHaveTextContent("Body");
  });

  it("renders CardFooter", () => {
    render(<CardFooter data-testid="footer">Footer</CardFooter>);
    expect(screen.getByTestId("footer")).toHaveTextContent("Footer");
  });

  it("renders a full card composition", () => {
    render(
      <Card data-testid="full-card">
        <CardHeader>
          <CardTitle>My Card</CardTitle>
        </CardHeader>
        <CardContent>Some content here</CardContent>
        <CardFooter>Footer area</CardFooter>
      </Card>
    );
    const card = screen.getByTestId("full-card");
    expect(card).toHaveTextContent("My Card");
    expect(card).toHaveTextContent("Some content here");
    expect(card).toHaveTextContent("Footer area");
  });

  it("accepts custom className on Card", () => {
    render(<Card className="custom-card" data-testid="card">X</Card>);
    expect(screen.getByTestId("card").className).toContain("custom-card");
  });
});
