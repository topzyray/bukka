// "use client";

// import * as React from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { useOrderMutation } from "@/hooks/useOrderMutation";

// interface OrderDialogProps {
//   businessId: string;
//   variant?: "menu" | "service";
// }

// export const OrderDialog: React.FC<OrderDialogProps> = ({
//   businessId,
//   variant = "menu",
// }) => {
//   const { createOrder, isLoading } = useOrderMutation();
//   const [itemName, setItemName] = React.useState("");
//   const [quantity, setQuantity] = React.useState(1);
//   const [note, setNote] = React.useState("");
//   const [open, setOpen] = React.useState(false);

//   const handleSubmit = async () => {
//     await createOrder({ businessId, itemName, quantity, note });
//     setOpen(false);
//     setItemName("");
//     setNote("");
//     setQuantity(1);
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button size="lg" variant="default">
//           {variant === "menu" ? "Order Menu" : "Request Service"}
//         </Button>
//       </DialogTrigger>

//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>
//             {variant === "menu" ? "Place Your Order" : "Request a Service"}
//           </DialogTitle>
//         </DialogHeader>

//         <div className="space-y-4 py-2">
//           <div>
//             <Label>Item / Service Name</Label>
//             <Input
//               placeholder={
//                 variant === "menu" ? "Enter dish or meal" : "Describe service"
//               }
//               value={itemName}
//               onChange={(e) => setItemName(e.target.value)}
//             />
//           </div>

//           <div>
//             <Label>Quantity</Label>
//             <Input
//               type="number"
//               min={1}
//               value={quantity}
//               onChange={(e) => setQuantity(Number(e.target.value))}
//             />
//           </div>

//           <div>
//             <Label>Note (optional)</Label>
//             <Textarea
//               placeholder="Any special instruction?"
//               value={note}
//               onChange={(e) => setNote(e.target.value)}
//             />
//           </div>
//         </div>

//         <DialogFooter>
//           <Button
//             disabled={isLoading || !itemName.trim()}
//             onClick={handleSubmit}
//           >
//             {isLoading ? "Submitting..." : "Confirm"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  Button,
  Input,
  Textarea,
  Label,
} from "@/components/ui";
import { useOrderMutation } from "@/data/mutations/order/use-order-mutation";

interface Props {
  businessId: string;
  variant?: "menu" | "service";
}

export const OrderDialog: React.FC<Props> = ({
  businessId,
  variant = "menu",
}) => {
  const [open, setOpen] = React.useState(false);
  const [itemName, setItemName] = React.useState("");
  const [quantity, setQuantity] = React.useState(1);
  const [note, setNote] = React.useState("");

  const mutation = useOrderMutation();

  const handleSubmit = async () => {
    await mutation.mutateAsync({ businessId, itemName, quantity, note });
    setOpen(false);
    setItemName("");
    setNote("");
    setQuantity(1);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" variant="default">
          {variant === "menu" ? "Order Menu" : "Request Service"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {variant === "menu" ? "Place Your Order" : "Request a Service"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Item / Service Name</Label>
            <Input
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Enter item or service"
            />
          </div>

          <div>
            <Label>Quantity</Label>
            <Input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>

          <div>
            <Label>Note</Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional instructions..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            disabled={mutation.isPending || !itemName.trim()}
            onClick={handleSubmit}
          >
            {mutation.isPending ? "Submitting..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
