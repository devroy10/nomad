/** The 120px dashed-cross spacer that ends most sections. */
export function SectionSpacer() {
  return (
    <div className="border-dashed-b">
      <div className="border-dashed-r mx-auto h-16 max-w-[1160px] border-dashed-l tablet:h-20 desktop:h-30" />
    </div>
  );
}
