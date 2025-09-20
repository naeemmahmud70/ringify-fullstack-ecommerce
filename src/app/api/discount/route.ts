export async function POST(req: Request) {
  try {
    const { code } = await req.json();

    if (!code) {
      return Response.json({
        status: 400,
        message: "Discount code is required!",
      });
    }

    // ✅ Read from env
    const validCode = process.env.DICCOUNT_CODE;
    const discountPercentage = Number(process.env.DISCOUNT_PERCENTAGE || 0);

    // ✅ Match code
    if (code.toLowerCase() === validCode?.toLowerCase()) {
      return Response.json({
        status: 200,
        message: "Discount applied!",
        discount: discountPercentage,
      });
    }

    return Response.json({
      status: 400,
      message: "Invalid discount code!",
    });
  } catch (error: any) {
    console.error("Discount API error:", error);

    return Response.json({
      status: 500,
      message: "Something went wrong!",
      details: error?.message || "Unknown error",
    });
  }
}
