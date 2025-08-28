<?php

namespace App\Http\Controllers;

use App\Enums\FinePaymentStatus;
use App\Enums\ReturnBookStatus;
use App\Models\ReturnBook;
use Exception;
use Illuminate\Http\Request;
use Midtrans\Config;
use Midtrans\Snap;

class PaymentController extends Controller
{
    public function create(Request $request)
    {
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production');
        Config::$isSanitized = true;
        Config::$is3ds = true;

        $params = [
            'transaction_details' => [
                'order_id' => $request->order_id,
                'gross_amount' => $request->gross_amount
            ],
            'customer_details' => [
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
            ]
        ];

        try {
            $snapToken = Snap::getSnapToken($params);
            return response()->json([
                'snapToken' => $snapToken,

            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function callback(Request $request)
    {
        $serverKey = config('services.midtrans.server_key');
        $signatureKey = signatureMidtrans($request->order_id, $request->status_code, $request->gross_amount, $serverKey);

        if ($request->signature_key !== $signatureKey) {
            return response()->json([
                'error' => 'Unauthorized'
            ], 401);
        }

        $return_book = ReturnBook::query()
            ->where('return_book_code', $request->order_id)
            ->first();


        if (!$return_book) {
            return response()->json([
                'message' => 'Pengembalian tidak ditemukan'
            ], 404);
        }


        if (!$return_book->fine) {
            return response()->json([
                'message' => 'Denda tidak ditemukan'
            ], 404);
        }

        switch ($request->transaction_status) {
            case 'settlement':
                $return_book->fine->payment_status = FinePaymentStatus::SUCCESS->value;
                $return_book->fine->save();

                $return_book->status = ReturnBookStatus::RETURNED->value;
                $return_book->save();

                return response()->json([
                    'message' => 'Berhasil melakukan pembayaran'
                ]);
                break;
            case 'capture':
                $return_book->fine->payment_status = FinePaymentStatus::SUCCESS->value;
                $return_book->fine->save();

                $return_book->status = ReturnBookStatus::RETURNED->value;
                $return_book->save();

                return response()->json([
                    'message' => 'Berhasil melakukan pembayaran'
                ]);
                break;
            case 'pending':
                $return_book->fine->payment_status = FinePaymentStatus::PENDING->value;
                $return_book->fine->save();

                return response()->json([
                    'message' => 'Pembayaran tertunda'
                ]);
                break;
            case 'expire':
                $return_book->fine->payment_status = FinePaymentStatus::FAILED->value;
                $return_book->fine->save();

                return response()->json([
                    'message' => 'Pembayaran kadaluarsa'
                ]);
                break;
            case 'cancel':
                $return_book->fine->payment_status = FinePaymentStatus::FAILED->value;
                $return_book->fine->save();

                return response()->json([
                    'message' => 'Pembayaran dibatalkan'
                ]);
                break;
            default:
                return response()->json([
                    'message' => 'Status Transaksi tidak diketahui'
                ], 400);
        }
    }

    public function success()
    {
        return inertia('Payments/Success');
    }
}
